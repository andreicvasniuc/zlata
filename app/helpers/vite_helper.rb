# Renders the tags for a Vite entry (`admin`, `app`) from public/build/.vite/manifest.json,
# which `pnpm build` writes and which is committed together with the build output.
module ViteHelper
  MANIFEST_PATH = Rails.public_path.join("build", ".vite", "manifest.json")
  BASE_PATH = "/build/"

  class MissingEntry < StandardError; end

  # Read once per process in production (the build is committed, so it never changes while running).
  def self.manifest
    return read_manifest if Rails.env.local?

    @manifest ||= read_manifest
  end

  def self.read_manifest
    JSON.parse(File.read(MANIFEST_PATH))
  rescue Errno::ENOENT
    raise MissingEntry, "#{MANIFEST_PATH} not found; run `pnpm build` in client/"
  end

  def vite_tags(entry)
    manifest = ViteHelper.manifest
    record = manifest.values.find { |item| item["isEntry"] && item["name"] == entry }
    raise MissingEntry, "No Vite entry '#{entry}' in #{MANIFEST_PATH}; run `pnpm build` in client/" unless record

    chunks = vite_chunks(manifest, record)
    stylesheets = chunks.flat_map { |chunk| chunk.fetch("css", []) }.uniq
    preloads = (chunks - [record]).map { |chunk| chunk.fetch("file") }

    safe_join(
      stylesheets.map { |file| tag.link(rel: "stylesheet", href: vite_path(file)) } +
      [tag.script("", src: vite_path(record.fetch("file")), type: "module", crossorigin: "anonymous")] +
      preloads.map { |file| tag.link(rel: "modulepreload", href: vite_path(file), crossorigin: "anonymous") },
      "\n"
    )
  end

  private

    def vite_path(file)
      "#{BASE_PATH}#{file}"
    end

    # The entry chunk plus everything it imports statically (shared chunks carry the CSS).
    def vite_chunks(manifest, record, seen = [])
      return seen if seen.include?(record)

      seen << record
      record.fetch("imports", []).each { |key| vite_chunks(manifest, manifest.fetch(key), seen) }
      seen
    end
end

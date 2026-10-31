require 'rails_helper'

RSpec.describe ViteHelper, type: :helper do
  describe '#vite_tags' do
    it 'renders the stylesheet, entry script and preloads of the committed build' do
      html = helper.vite_tags('admin')

      expect(html).to match(%r{<link rel="stylesheet" href="/build/assets/[^"]+\.css"})
      expect(html).to match(%r{<script src="/build/assets/admin-[^"]+\.js" type="module" crossorigin="anonymous"></script>})
      expect(html).to match(%r{<link rel="modulepreload" href="/build/assets/[^"]+\.js"})
    end

    it 'fails loudly for an unknown entry' do
      expect { helper.vite_tags('nope') }.to raise_error(ViteHelper::MissingEntry, /nope/)
    end
  end

  # Guards against committing source changes without the matching `pnpm build` output.
  describe 'the committed build' do
    it 'has every file the manifest points to' do
      manifest = ViteHelper.manifest
      files = manifest.values.flat_map { |item| [item['file'], *item['css'], *item['assets']] }.compact.uniq

      expect(files).not_to be_empty
      missing = files.reject { |file| Rails.public_path.join('build', file).exist? }
      expect(missing).to be_empty
    end
  end
end

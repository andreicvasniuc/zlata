require Rails.root.join('lib', 'data_processor').to_s

class Admin::DataController < SecuredController
  def export
    dataProcessor = DataProcessor.new
    render json: { data: dataProcessor.export }
  end

  def import
    path = "#{Rails.root}/public/data/#{I18n.locale}.json"
    unless File.exist?(path)
      render json: { message: "Import file #{path} doesn't exist" } 
      return
    end
    
    json = JSON.parse(File.read(path))
    dataProcessor = DataProcessor.new
    render json: dataProcessor.import(json)
  end
end
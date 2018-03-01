class ContactMailer < ApplicationMailer
  def contact_email(contact)
    @contact = contact
    mail(to: ENV['to_email'], subject: "Новый контак с сайта Zlata_weddingfasion: #{contact['email']}")
  end
end

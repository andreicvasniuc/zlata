class ContactsController < ApplicationController
  # POST /api/contacts/send
  # POST /api/contacts/send.json
  def send_form
    render json: { contact: contact_params }
  end

  private
    def contact_params
      params.require(:contact).permit(:name, :email, :phone, :message)
    end
end

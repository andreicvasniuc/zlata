class Admin::ContactsController < SecuredController
  before_action :set_contact_group
  before_action :set_contact, only: [:show, :update, :destroy]

  # GET /admin/contact_groups/:contact_group_id/contacts/1
  # GET /admin/contact_groups/:contact_group_id/contacts/1.json
  def show
    render json: @contact
  end

  # POST /admin/contact_groups/:contact_group_id/contacts
  # POST /admin/contact_groups/:contact_group_id/contacts.json
  def create
    @contact = @contact_group.contacts.build(contact_params)

    if @contact.save
      render json: @contact, status: :created
    else
      render json: @contact.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /admin/contact_groups/:contact_group_id/contacts/1
  # PATCH/PUT /admin/contact_groups/:contact_group_id/contacts/1.json
  def update
    if @contact.update(contact_params)
      render json: @contact, status: :ok
    else
      render json: @contact.errors, status: :unprocessable_entity
    end
  end

  # DELETE /admin/contact_groups/:contact_group_id/contacts/1
  # DELETE /admin/contact_groups/:contact_group_id/contacts/1.json
  def destroy
    @contact.destroy

    render json: @contact, status: :ok
  end
  
  private

    def set_contact_group
      @contact_group = Admin::ContactGroup.find(params[:contact_group_id])
    end

    def set_contact
      @contact = @contact_group.contacts.find(params[:id])
    end

    def contact_params
      params.require(:contact).permit(:name, :published)
    end
end

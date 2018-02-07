class Admin::ContactGroupsController < SecuredController
  before_action :set_contact_group, only: [:show, :update, :destroy]

  # POST /admin/contact_groups/search
  # POST /admin/contact_groups/search.json
  def search
    @contact_groups, @total_count = Admin::ContactGroup.search(params[:search], params[:pagination], params[:sorting])

    render json: { contact_groups: @contact_groups, totalCount: @total_count }
  end

  # GET /admin/contact_groups/list
  # GET /admin/contact_groups/list.json
  def list
    @contact_groups = Admin::ContactGroup.names

    render json: { contact_groups: @contact_groups }
  end

  # GET /admin/contact_groups/1
  # GET /admin/contact_groups/1.json
  def show
    render json: @contact_group
  end

  # POST /admin/contact_groups
  # POST /admin/contact_groups.json
  def create
    @contact_group = Admin::ContactGroup.new(contact_group_params)

    if @contact_group.save
      render json: @contact_group, status: :created
    else
      render json: @contact_group.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /admin/contact_groups/1
  # PATCH/PUT /admin/contact_groups/1.json
  def update
    if @contact_group.update(contact_group_params)
      render json: @contact_group, status: :ok
    else
      render json: @contact_group.errors, status: :unprocessable_entity
    end
  end

  # DELETE /admin/contact_groups/1
  # DELETE /admin/contact_groups/1.json
  def destroy
    @contact_group.destroy

    render json: @contact_group, status: :ok
  end
  
  private

    def set_contact_group
      @contact_group = Admin::ContactGroup.find(contact_group_id)
    end

    def contact_group_id
      params[:id]
    end

    def contact_group_params
      params.require(:contact_group).permit(:name, :published)
    end
end

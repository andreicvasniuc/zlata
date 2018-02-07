class ContactGroupsController < ApplicationController
  # GET /api/contact_groups/list
  # GET /api/contact_groups/list.json
  def list
    render json: { contact_groups: ContactGroup.published_contact_groups }
  end
end

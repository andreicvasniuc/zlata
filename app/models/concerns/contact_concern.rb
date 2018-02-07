require 'active_support/concern'

module ContactConcern
  extend ActiveSupport::Concern

  included do
    field :name, type: String
    field :published, type: Boolean

    default_scope -> { order(:updated_at => :desc) }
  end
end
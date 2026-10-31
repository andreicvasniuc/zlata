class Exceptions::UserNotFound < StandardError
  def initialize(message = "User not found")
    super(message)
  end
end

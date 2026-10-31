require "jwt"

# Issues and verifies the admin JWTs: HS256, signed with the app's secret key base, valid for one day.
class AuthToken
  ALGORITHM = "HS256".freeze
  LIFETIME = 1.day

  def self.issue(user)
    JWT.encode({ sub: user.id.to_s, exp: LIFETIME.from_now.to_i }, secret, ALGORITHM)
  end

  # The user the token was issued for, or nil when the token is missing, malformed, expired,
  # signed with another key, or its user no longer exists.
  def self.user_for(token)
    return if token.blank?

    payload, = JWT.decode(token, secret, true, algorithm: ALGORITHM)
    id = payload["sub"]
    User.where(id: id).first if id.is_a?(String)
  rescue JWT::DecodeError
    nil
  end

  def self.secret
    Rails.application.secret_key_base
  end
  private_class_method :secret
end

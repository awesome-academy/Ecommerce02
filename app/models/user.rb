class User < ApplicationRecord
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i


  has_many :contacts
  has_many :ranks
  has_many :comments
  has_one :history
  has_many :orders
  enum role: { admin: 0, member: 1 }

  has_secure_password

  validates :address, presence: true,
    length: {maximum: Settings.user.address_max_length}
  validates :email, presence: true, length: {maximum: Settings.user.email_length},
    format: {with: VALID_EMAIL_REGEX}, uniqueness: {case_sensitive: false}
  validates :name, presence: true, length: {maximum: Settings.user.name_length}
  validates :password, presence: true,
    length: {minimum: Settings.user.pass_length}, allow_nil: true
  validates :phone, presence: true,
    length: {maximum: Settings.user.phone_number_length}

  before_save ->{email.downcase!}

  def self.digest string
    cost = if ActiveModel::SecurePassword.min_cost
             BCrypt::Engine::MIN_COST
           else
             BCrypt::Engine.cost
           end
    BCrypt::Password.create(string, cost: cost)
  end
end

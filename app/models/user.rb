class User < ApplicationRecord
  belongs_to :type_user
  has_many :contacts
  has_many :ranks
  has_many :comments
  has_one :history
  has_many :orders
  enum role: { admin: 0, member: 1 }	
end

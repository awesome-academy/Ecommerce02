class PersonPostNew < ApplicationRecord
  belongs_to :user
  has_many :ranks
  has_many :comments
end

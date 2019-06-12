class Rank < ApplicationRecord
  belongs_to :user
  belongs_to :product
  belongs_to :person_post_new
end

class Order < ApplicationRecord
  belongs_to :user
  has_many :order_details
  enum status: { put: 0, wait: 1, approved: 2, sent: 3 }
end

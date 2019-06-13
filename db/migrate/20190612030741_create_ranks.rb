class CreateRanks < ActiveRecord::Migration[5.2]
  def change
    create_table :ranks do |t|
      t.integer :star_level
      t.references :users, foreign_key: true
      t.references :products, foreign_key: true
      t.references :person_post_news, foreign_key: true

      t.timestamps
    end
  end
end

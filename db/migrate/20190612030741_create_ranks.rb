class CreateRanks < ActiveRecord::Migration[5.2]
  def change
    create_table :ranks do |t|
      t.integer :star_level
      t.references :user, foreign_key: true
      t.references :product, foreign_key: true
      t.references :person_post_new, foreign_key: true

      t.timestamps
    end
  end
end

class CreatePersonPostNews < ActiveRecord::Migration[5.2]
  def change
    create_table :person_post_news do |t|
      t.datetime :created_at
      t.string :image
      t.text :description
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end

Rails.application.routes.draw do
  get "sessions/new"
  get "users/new"
  root "view_web#home"

  get "/admin", to: "view_admin#home"
  get "view_web/home", to: "view_web#home"
  get "view_web/about", to: "view_web#about"
  get "view_web/contacts", to: "view_web#contacts"
  get "view_web/product", to: "view_web#product"
  get "view_web/collections", to: "view_web#collections"
  get "view_web/account/register", to: "users#new"
  post "view_web/account/register",  to: "users#create"
  get "view_web/account", to: "view_web#account"
  get "view_web/cart", to: "view_web#cart"
  get "view_web/account/login", to: "sessions#new"
  post "view_web/account/login",  to: "sessions#create"
  delete "view_web/account/logout",  to: "sessions#destroy"
  resources :users


  resources :categories
  resources :small_categories
end

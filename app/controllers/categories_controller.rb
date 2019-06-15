class CategoriesController < ApplicationController
  before_action :load_category, except: [:new, :index, :create]
  def index
  	@categories = Category.all
  end
  def edit
    
  end
  def new
  	@category = Category.new
  end
  def create
    @category = Category.new category_params
    if @category.save
      redirect_to categories_path
    else
      render :new
    end
  end

  def update
    if @category.update_attributes(category_params)
      flash[:success] = t "updated"
      redirect_to categories_path
    else
      render :edit
    end
  end

  def destroy
    if @category.destroy
      flash[:success] = t "category_deleted"
      redirect_to categories_path
    else
      flash[:danger] = t "category_not_found"
      redirect_to categories_path
    end
  end


  private

    def category_params
      params.require(:category).permit(:name, :description)
    end

    def load_category
      @category = Category.find_by id: params[:id] 
      return if @category

      flash[:danger] = t "category_not_found"
      redirect_to root_path
  end
end

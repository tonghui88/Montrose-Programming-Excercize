// =============================================================================
// RECIPE MANAGER - Optimized and Refactored
// =============================================================================

class RecipeManager {
    constructor() {
        this.currentRecipeId = null;
        this.apiBaseUrl = '/api/recipe';
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    // =============================================================================
    // EVENT LISTENERS
    // =============================================================================
    
    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupModalEventListeners();
            this.setupDeleteConfirmationListener();
        });
    }

    setupModalEventListeners() {
        // Add modal cleanup
        this.addModalCleanupListener('addRecipeModal', {
            nameInput: 'modalRecipeNameInput',
            contentInput: 'modalRecipeContentInput',
            errorContainer: '#addRecipeModal'
        });

        // Edit modal cleanup
        this.addModalCleanupListener('editRecipeModal', {
            nameInput: 'editRecipeNameInput',
            contentInput: 'editRecipeContentInput',
            errorContainer: '#editRecipeModal'
        });
    }

    addModalCleanupListener(modalId, fields) {
        document.getElementById(modalId).addEventListener('hidden.bs.modal', () => {
            document.getElementById(fields.nameInput).value = '';
            document.getElementById(fields.contentInput).value = '';
            this.clearValidationErrors(fields.errorContainer);
        });
    }

    setupDeleteConfirmationListener() {
        document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
            if (this.currentRecipeId) {
                this.submitDeleteForm();
            }
        });
    }

    // =============================================================================
    // RECIPE SELECTION
    // =============================================================================
    
    async handleRecipeSelection() {
        const dropdown = document.getElementById("recipeDropdown");
        const selectedRecipeId = dropdown.options[dropdown.selectedIndex].value;
        const recipeDisplay = document.getElementById("recipeDisplay");

        if (!selectedRecipeId) {
            this.hideRecipeDisplay();
            return;
        }

        try {
            const recipe = await this.fetchRecipe(selectedRecipeId);
            this.displayRecipe(recipe);
            this.currentRecipeId = recipe.id;
        } catch (error) {
            console.error('Error fetching recipe:', error);
            this.hideRecipeDisplay();
        }
    }

    async fetchRecipe(id) {
        const response = await fetch(`${this.apiBaseUrl}/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch recipe');
        }
        return await response.json();
    }

    displayRecipe(recipe) {
        document.getElementById("recipeName").textContent = recipe.name;
        document.getElementById("recipeContent").textContent = recipe.recipe;
        document.getElementById("recipeDisplay").style.display = "block";
    }

    hideRecipeDisplay() {
        document.getElementById("recipeDisplay").style.display = "none";
        this.currentRecipeId = null;
    }

    // =============================================================================
    // RECIPE CRUD OPERATIONS
    // =============================================================================
    
    async createRecipe(name, recipe) {
        const response = await this.makeApiCall('POST', '', { name, recipe });
        if (response.ok) {
            const newRecipe = await response.json();
            this.showSuccessToast(`Recipe "${newRecipe.name}" added successfully!`);
            this.addRecipeToDropdown(newRecipe);
            return newRecipe;
        } else {
            const error = await response.text();
            throw new Error(error);
        }
    }

    async updateRecipe(id, name, recipe) {
        const response = await this.makeApiCall('PUT', `/${id}`, { name, recipe });
        if (response.ok) {
            this.showSuccessToast("Recipe updated successfully!");
            this.updateRecipeInUI(id, name, recipe);
            return true;
        } else {
            const error = await response.text();
            throw new Error(error);
        }
    }

    async deleteRecipe(id) {
        const response = await this.makeApiCall('DELETE', `/${id}`);
        if (response.ok) {
            this.showSuccessToast("Recipe deleted successfully!");
            this.removeRecipeFromUI(id);
            return true;
        } else {
            throw new Error('Failed to delete recipe');
        }
    }

    async makeApiCall(method, endpoint, data = null) {
        const config = {
            method,
            headers: { 'Content-Type': 'application/json' }
        };
        
        if (data) {
            config.body = JSON.stringify(data);
        }
        
        return await fetch(`${this.apiBaseUrl}${endpoint}`, config);
    }

    // =============================================================================
    // UI UPDATES
    // =============================================================================
    
    addRecipeToDropdown(recipe) {
        const dropdown = document.getElementById('recipeDropdown');
        const option = document.createElement('option');
        option.value = recipe.id;
        option.textContent = recipe.name;
        dropdown.appendChild(option);
    }

    updateRecipeInUI(id, name, recipe) {
        // Update displayed recipe
        document.getElementById("recipeName").textContent = name;
        document.getElementById("recipeContent").textContent = recipe;
        
        // Update dropdown option
        const dropdown = document.getElementById('recipeDropdown');
        const option = dropdown.querySelector(`option[value="${id}"]`);
        if (option) {
            option.textContent = name;
        }
    }

    removeRecipeFromUI(id) {
        // Remove from dropdown
        const dropdown = document.getElementById('recipeDropdown');
        const option = dropdown.querySelector(`option[value="${id}"]`);
        if (option) {
            option.remove();
        }
        
        // Hide recipe display
        this.hideRecipeDisplay();
    }

    // =============================================================================
    // MODAL OPERATIONS
    // =============================================================================
    
    openAddModal() {
        const modal = new bootstrap.Modal(document.getElementById('addRecipeModal'));
        modal.show();
    }

    openEditModal() {
        if (!this.currentRecipeId) return;
        
        const currentName = document.getElementById("recipeName").textContent;
        const currentRecipe = document.getElementById("recipeContent").textContent;
        
        document.getElementById("editRecipeNameInput").value = currentName;
        document.getElementById("editRecipeContentInput").value = currentRecipe;
        this.clearValidationErrors('#editRecipeModal');
        
        const modal = new bootstrap.Modal(document.getElementById('editRecipeModal'));
        modal.show();
    }

    openDeleteModal() {
        if (!this.currentRecipeId) {
            console.error('No recipe selected for deletion');
            return;
        }
        
        const recipeName = document.getElementById("recipeName").textContent;
        document.getElementById("recipeToDeleteName").textContent = recipeName;
        
        const modal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
        modal.show();
    }

    // =============================================================================
    // FORM SUBMISSIONS
    // =============================================================================
    
    async submitAddForm() {
        const formData = this.getFormData('addRecipeModal', {
            name: 'modalRecipeNameInput',
            content: 'modalRecipeContentInput'
        });

        if (!this.validateFormData(formData, 'addRecipeModal')) {
            return;
        }

        const buttonConfig = this.getButtonConfig('addRecipeModal');
        this.setLoadingState(buttonConfig, true, 'Adding...');

        try {
            await this.createRecipe(formData.name, formData.content);
            this.clearForm('addRecipeModal', {
                name: 'modalRecipeNameInput',
                content: 'modalRecipeContentInput'
            });
            this.closeModal('addRecipeModal');
        } catch (error) {
            this.showFormError('addRecipeModal', 'modalNameError', error.message);
        } finally {
            this.setLoadingState(buttonConfig, false, 'Add Recipe');
        }
    }

    async submitEditForm() {
        const formData = this.getFormData('editRecipeModal', {
            name: 'editRecipeNameInput',
            content: 'editRecipeContentInput'
        });

        if (!this.validateFormData(formData, 'editRecipeModal')) {
            return;
        }

        const buttonConfig = this.getButtonConfig('editRecipeModal');
        this.setLoadingState(buttonConfig, true, 'Updating...');

        try {
            await this.updateRecipe(this.currentRecipeId, formData.name, formData.content);
            this.closeModal('editRecipeModal');
        } catch (error) {
            this.showFormError('editRecipeModal', 'editNameError', error.message);
        } finally {
            this.setLoadingState(buttonConfig, false, 'Update Recipe');
        }
    }

    async submitDeleteForm() {
        if (!this.currentRecipeId) {
            console.error('No recipe selected for deletion');
            return;
        }

        const buttonConfig = this.getButtonConfig('deleteConfirmModal');
        this.setLoadingState(buttonConfig, true, 'Deleting...');

        try {
            await this.deleteRecipe(this.currentRecipeId);
            this.closeModal('deleteConfirmModal');
        } catch (error) {
            console.error('Delete error:', error);
            this.showErrorToast(error.message);
        } finally {
            this.setLoadingState(buttonConfig, false, 'Delete Recipe');
        }
    }

    // =============================================================================
    // FORM UTILITIES
    // =============================================================================
    
    getFormData(modalId, fieldMap) {
        return {
            name: document.getElementById(fieldMap.name).value.trim(),
            content: document.getElementById(fieldMap.content).value.trim()
        };
    }

    validateFormData(formData, modalId) {
        this.clearValidationErrors(`#${modalId}`);
        let hasErrors = false;

        if (!formData.name) {
            this.showFieldError(modalId, 'name', 'Recipe name is required');
            hasErrors = true;
        }

        if (!formData.content) {
            this.showFieldError(modalId, 'content', 'Recipe instructions are required');
            hasErrors = true;
        }

        return !hasErrors;
    }

    showFieldError(modalId, fieldType, message) {
        const fieldMap = {
            'addRecipeModal': { name: 'modalNameError', content: 'modalContentError' },
            'editRecipeModal': { name: 'editNameError', content: 'editContentError' }
        };
        
        const inputMap = {
            'addRecipeModal': { name: 'modalRecipeNameInput', content: 'modalRecipeContentInput' },
            'editRecipeModal': { name: 'editRecipeNameInput', content: 'editRecipeContentInput' }
        };

        const errorId = fieldMap[modalId][fieldType];
        const inputId = inputMap[modalId][fieldType];
        
        this.showFormError(modalId, errorId, message);
        document.getElementById(inputId).classList.add('is-invalid');
    }

    showFormError(modalId, errorId, message) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    clearValidationErrors(container) {
        const containerElement = typeof container === 'string' ? document.querySelector(container) : container;
        containerElement.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        containerElement.querySelectorAll('.invalid-feedback').forEach(el => el.textContent = '');
    }

    clearForm(modalId, fieldMap) {
        document.getElementById(fieldMap.name).value = '';
        document.getElementById(fieldMap.content).value = '';
    }

    getButtonConfig(modalId) {
        const buttonMap = {
            'addRecipeModal': { btn: '.btn-primary', spinner: 'modalSpinner', text: 'modalButtonText' },
            'editRecipeModal': { btn: '.btn-primary', spinner: 'editSpinner', text: 'editButtonText' },
            'deleteConfirmModal': { btn: '#confirmDeleteBtn', spinner: 'deleteSpinner', text: 'deleteButtonText' }
        };

        const config = buttonMap[modalId];
        return {
            button: document.querySelector(`#${modalId} ${config.btn}`),
            spinner: document.getElementById(config.spinner),
            text: document.getElementById(config.text)
        };
    }

    setLoadingState(buttonConfig, isLoading, text) {
        if (isLoading) {
            buttonConfig.spinner.classList.remove('d-none');
            buttonConfig.text.textContent = text;
            buttonConfig.button.disabled = true;
        } else {
            buttonConfig.spinner.classList.add('d-none');
            buttonConfig.text.textContent = text;
            buttonConfig.button.disabled = false;
        }
    }

    closeModal(modalId) {
        const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
        if (modal) {
            modal.hide();
        }
    }

    // =============================================================================
    // NOTIFICATIONS
    // =============================================================================
    
    showSuccessToast(message) {
        this.showToast('successToast', 'successToastBody', message);
    }

    showErrorToast(message) {
        this.showToast('errorToast', 'errorToastBody', message);
    }

    showToast(toastId, bodyId, message) {
        const toastBody = document.getElementById(bodyId);
        toastBody.textContent = message;
        const toast = new bootstrap.Toast(document.getElementById(toastId));
        toast.show();
    }
}

// =============================================================================
// GLOBAL INSTANCE AND PUBLIC FUNCTIONS
// =============================================================================

const recipeManager = new RecipeManager();

// Public functions for HTML onclick handlers
function handleRecipeSelection() {
    recipeManager.handleRecipeSelection();
}

function editRecipe() {
    recipeManager.openEditModal();
}

function deleteRecipe() {
    recipeManager.openDeleteModal();
}

function submitModalForm() {
    recipeManager.submitAddForm();
}

function submitEditModalForm() {
    recipeManager.submitEditForm();
}

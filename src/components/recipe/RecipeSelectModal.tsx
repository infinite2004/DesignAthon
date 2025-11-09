import React from 'react';
import { Modal } from '../ui/Modal';
import type { Recipe } from '../../types';
import { RecipeTile } from './RecipeTile';

type RecipeSelectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  recipes: Recipe[];
  onSelect: (recipe: Recipe) => void;
};

export const RecipeSelectModal: React.FC<RecipeSelectModalProps> = ({
  isOpen,
  onClose,
  recipes,
  onSelect,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Attach a recipe">
      <div className="max-h-[60vh] space-y-2 overflow-y-auto">
        {recipes.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">
            No recipes available
          </p>
        ) : (
          recipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => {
                onSelect(recipe);
                onClose();
              }}
              className="cursor-pointer"
            >
              <RecipeTile recipe={recipe} showStats />
            </div>
          ))
        )}
      </div>
    </Modal>
  );
};


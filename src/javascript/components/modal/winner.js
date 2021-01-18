import { showModal } from './modal';
import { createFighterImage } from '../../components/fighterPreview';

export function showWinnerModal(fighter) {
  const arenaRootElement = document.querySelector('.arena___root');
  arenaRootElement.innerHTML = '';

  showModal({
    title: `${fighter.name} won!`,
    bodyElement: createFighterImage(fighter),
    onClose: () => location.reload(),
  });
}

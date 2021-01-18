import { createElement } from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`,
  });

  if (fighter) {
    const imgElement = createFighterImage(fighter);
    const detailsElement = createFighterDetails(fighter);
    fighterElement.append(imgElement, detailsElement);
  }

  return fighterElement;
}

export function createFighterImage(fighter) {
  const { source, name } = fighter;
  const attributes = {
    src: source,
    title: name,
    alt: name,
  };
  const imgElement = createElement({
    tagName: 'img',
    className: 'fighter-preview___img',
    attributes,
  });

  return imgElement;
}

export function createFighterDetails(fighter) {
  const fighterDetails = createElement({
    tagName: 'div',
    className: 'fighter-preview___details',
  });
  const { name, health, attack, defense } = fighter;
  const nameElement = createElement({ tagName: 'h3', className: 'fighter-preview__name' });
  const detailsElement = createElement({ tagName: 'ul', className: 'fighter-preview___info' });
  const healthElement = createFighterCharacteristic('Health', health, 'fas fa-heart');
  const attackElement = createFighterCharacteristic('Attack', attack, 'fas fa-fist-raised');
  const defenceElement = createFighterCharacteristic('Defence', defense, 'fas fa-shield-alt');
  nameElement.innerText = name;

  detailsElement.append(healthElement, attackElement, defenceElement);
  fighterDetails.append(nameElement, detailsElement);

  return fighterDetails;
}

export function createFighterCharacteristic(property, value, iconClassName) {
  const infoItem = createElement({ tagName: 'li', className: 'fighter-preview___info-item' });
  const divElement = createElement({ tagName: 'div' });
  const iconElement = createElement({ tagName: 'i', className: iconClassName });
  const propertyNameElement = createElement({ tagName: 'span' });
  const propertyValueElement = createElement({ tagName: 'span' });
  propertyNameElement.innerText = property + ':';
  propertyValueElement.innerText = value;

  divElement.append(iconElement, propertyNameElement);
  infoItem.append(divElement, propertyValueElement);

  return infoItem;
}

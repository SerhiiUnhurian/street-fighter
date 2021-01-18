import { controls } from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    const {
      PlayerOneAttack,
      PlayerOneBlock,
      PlayerTwoAttack,
      PlayerTwoBlock,
      PlayerOneCriticalHitCombination,
      PlayerTwoCriticalHitCombination,
    } = controls;
    let pressedKeys = new Set();
    firstFighter.position = 'left';
    secondFighter.position = 'right';

    function onKeyDown(event) {
      if (event.repeat) return;

      pressedKeys.add(event.code);

      switch (event.code) {
        case PlayerOneAttack:
          if (!firstFighter.block && !secondFighter.block) {
            attack(firstFighter, secondFighter);
          }
          break;
        case PlayerTwoAttack:
          if (!firstFighter.block && !secondFighter.block) {
            attack(secondFighter, firstFighter);
          }
          break;
        case PlayerOneBlock:
          firstFighter.block = true;
          break;
        case PlayerTwoBlock:
          secondFighter.block = true;
          break;
      }

      if (isPlayerOneCriticalHitCombination()) {
        critAttack(firstFighter, secondFighter);
      }
      if (isPlayerTwoCriticalHitCombination()) {
        critAttack(secondFighter, firstFighter);
      }
    }

    function onKeyUp(event) {
      pressedKeys.delete(event.code);

      switch (event.code) {
        case PlayerOneBlock:
          firstFighter.block = false;
          break;
        case PlayerTwoBlock:
          secondFighter.block = false;
          break;
      }
    }

    function isPlayerOneCriticalHitCombination() {
      for (let key of PlayerOneCriticalHitCombination) {
        if (!pressedKeys.has(key)) return false;
      }
      return true;
    }

    function isPlayerTwoCriticalHitCombination() {
      for (let key of PlayerTwoCriticalHitCombination) {
        if (!pressedKeys.has(key)) return false;
      }
      return true;
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('gameOver', (event) => {
      const winner = event.loser === secondFighter ? firstFighter : secondFighter;
      resolve(winner);
    });
  });
}

export function getDamage(attacker, defender) {
  const damage = getHitPower(attacker) - getBlockPower(defender);

  return damage > 0 ? damage : 0;
}

export function getHitPower(fighter) {
  const criticalChance = Math.floor(Math.random() * 2 + 1);
  const power = fighter.attack * criticalChance;
  return power;
}

export function getCritPower(fighter) {
  const power = fighter.attack * 2;
  return power;
}
export function getBlockPower(fighter) {
  const dodgeChance = Math.floor(Math.random() * 2 + 1);
  const power = fighter.defense * dodgeChance;
  return power;
}

export function attack(attacker, defender) {
  const damage = getDamage(attacker, defender);
  reduceHealth(defender, damage);
}

export function critAttack(attacker, defender) {
  let isCooldown = attacker.isCritCooldown ?? false;

  if (isCooldown) return;

  const damage = getCritPower(attacker);
  reduceHealth(defender, damage);
  attacker.isCritCooldown = true;
  setTimeout(() => (attacker.isCritCooldown = false), 10000);
}

export function reduceHealth(fighter, damage) {
  const healthIndicator = document.querySelector(`#${fighter.position}-fighter-indicator`);
  const currentHealth = Number.parseInt(healthIndicator.style.width || '100%');
  const damageInPercent = (damage * 100) / fighter.health;
  const indicatorWidth = Math.max(0, currentHealth - damageInPercent);
  healthIndicator.style.width = `${indicatorWidth}%`;

  if (indicatorWidth === 0) {
    const event = new Event('gameOver');
    event.loser = fighter;
    document.dispatchEvent(event);
  }
}

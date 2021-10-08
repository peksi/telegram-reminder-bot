
export type Chore = {
  name: string;
  command: string;
  description: string;
  points: number;
}

export const chores: Chore[] = [
  {
    name: 'Astianpesukone',
    command: 'apk',
    description: 'puhtaiden tyhjäys & leijuvat likaiset sisään',
    points: 5
  },
  {
    name: 'Bio',
    command: 'bio',
    description: 'roskis-run sisältäen bion',
    points: 5
  },
  {
    name: 'Roskat',
    command: 'roskat',
    description: 'roskis-run ilman bioo',
    points: 5
  },
  {
    name: 'Pullot',
    command: 'pullot',
    description: 'kauppaan',
    points: 5
  },
  {
    name: 'Neato',
    command: 'neato',
    description: 'laita Neato siivoo sun puolesta',
    points: 5
  },
  {
    name: 'Pyykit',
    command: 'pyykit',
    description: 'yks koneellinen',
    points: 5
  },
  {
    name: 'Imuroi',
    command: 'imuroi',
    description: 'nurkista jne vaikeista paikoista',
    points: 10
  },
  {
    name: 'Pölyjen pyyhkiminen',
    command: 'polyt',
    description: 'pölyjen pyyhkiminen rätillä',
    points: 10
  },
  {
    name: 'Kukkien kastelu',
    command: 'kukat',
    description: 'kukkien kastelu',
    points: 3
  },
];

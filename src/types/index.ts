export interface Produit {
  id?: number;
  nom: string;
  type: string;
  stock: number;
  fournisseur: string;
}

export interface Machine {
  id?: number;
  nom: string;
  etat: string;
  derniereMaintenance: string;
}

export interface Employe {
  id?: number;
  nom: string;
  poste: string;
  machineAssignee?: Machine;
}

export interface OrdreFabrication {
  id?: number;
  projet: string;
  quantite: number;
  date: string;
  etat: string;
  produit?: Produit;
}

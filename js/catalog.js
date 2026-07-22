const ClothingCatalog = {
  ALL: [
    { id: "majtki", label: "Ubierz majtki", icon: "majtki" },
    { id: "podkoszulka", label: "Ubierz podkoszulkę", icon: "podkoszulka" },
    { id: "koszulka", label: "Ubierz koszulkę", icon: "koszulka" },
    { id: "spodnie", label: "Ubierz spodnie", icon: "spodnie" },
    { id: "skarpetki", label: "Ubierz skarpetki", icon: "skarpetki" },
    { id: "buty", label: "Ubierz buty", icon: "buty" },
    { id: "bluza", label: "Ubierz bluzę", icon: "bluza" },
  ],

  DEFAULT_ORDER: ["majtki", "skarpetki", "koszulka", "spodnie"],

  byId(id) {
    return this.ALL.find((item) => item.id === id) || null;
  },
};

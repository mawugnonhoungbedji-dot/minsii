export interface Arrondissement {
    name: string;
}

export interface Commune {
    name: string;
    arrondissements: string[];
}

export interface Departement {
    name: string;
    communes: Commune[];
}

export const BENIN_LOCATIONS: Departement[] = [
    {
        name: "Alibori",
        communes: [
            {
                name: "Banikoara",
                arrondissements: ["Banikoara", "Founougo", "Gomparou", "Goumori", "Kokey", "Kokiborou", "Ounet", "Sori", "Soroko", "Toura"]
            },
            {
                name: "Gogounou",
                arrondissements: ["Gogounou", "Bagou", "Gounarou", "Sori", "Sougou-Kpan-Trossi", "Zoungou-Pantrossi"]
            },
            {
                name: "Kandi",
                arrondissements: ["Kandi I", "Kandi II", "Kandi III", "Angaradébou", "Bensékou", "Donwari", "Kassakou", "Sam", "Saah", "Thui"]
            },
            {
                name: "Karimama",
                arrondissements: ["Karimama", "Birni-Lafia", "Bogo-Bogo", "Kompa", "Monsey"]
            },
            {
                name: "Malanville",
                arrondissements: ["Malanville", "Garou", "Guéné", "Madécali", "Toumboutou"]
            },
            {
                name: "Ségbana",
                arrondissements: ["Ségbana", "Liboussou", "Moussakongo", "Piassi", "Sokotindji"]
            }
        ]
    },
    {
        name: "Atacora",
        communes: [
            {
                name: "Boukoumbé",
                arrondissements: ["Boukoumbé", "Dipoli", "Korontière", "Kossoucoingou", "Koubéri", "Manta", "Natta", "Tabota"]
            },
            {
                name: "Cobly",
                arrondissements: ["Cobly", "Datori", "Koundokpoé", "Tapoga"]
            },
            {
                name: "Kérou",
                arrondissements: ["Kérou", "Bagou", "Birni", "Firou", "Kaobagou", "Koabagou"]
            },
            {
                name: "Kouandé",
                arrondissements: ["Kouandé", "Birni", "Chabi-Couma", "Dampégré", "Djougou", "Fô-Bouré", "Guilmaro", "Oroukayo"]
            },
            {
                name: "Matéri",
                arrondissements: ["Matéri", "Dassari", "Gouandé", "Nodi", "Tantéga", "Tchanwassaga"]
            },
            {
                name: "Natitingou",
                arrondissements: ["Natitingou I", "Natitingou II", "Natitingou III", "Kounakouanou", "Koutateri", "Perma", "Taïakou", "Tchabicouma"]
            },
            {
                name: "Péhunco",
                arrondissements: ["Péhunco", "Gnémasson"]
            },
            {
                name: "Tanguiéta",
                arrondissements: ["Tanguiéta", "Cotiakou", "Kouaba", "Taiacou", "Tanongou"]
            }
        ]
    },
    {
        name: "Atlantique",
        communes: [
            {
                name: "Abomey-Calavi",
                arrondissements: ["Godomey", "Akassato", "Togba", "Zinvié", "Kpanroun", "Ouèdo", "Glo-Djigbé", "Hêvié"]
            },
            {
                name: "Allada",
                arrondissements: ["Allada", "Attogon", "Avakpa", "Azohouè-Aliho", "Azohouè-Cada", "Hinvi", "Lissègazoun", "Lon-Agonmè", "Sékou", "Togoudo"]
            },
            {
                name: "Kpomassè",
                arrondissements: ["Kpomassè", "Dékanmè", "Sègbohouè", "Sègbèya", "Tokpa-Domè"]
            },
            {
                name: "Ouidah",
                arrondissements: ["Ouidah I", "Ouidah II", "Ouidah III", "Ouidah IV", "Avlékété", "Pahou", "Djègbadji", "Savi"]
            },
            {
                name: "Sô-Ava",
                arrondissements: ["Sô-Ava", "Agbanto", "Ahomey-Lokpo", "Dékanmey", "Ganvié I", "Ganvié II", "Houédo-Gbadji", "Vekky"]
            },
            {
                name: "Toffo",
                arrondissements: ["Toffo", "Ague", "Aholouyèmè", "Coussi", "Damè", "Djanglanmè", "Éklomè", "Ganvié-Bénin", "Houégamè", "Kpomè", "Séhouè"]
            },
            {
                name: "Tori-Bossito",
                arrondissements: ["Tori-Bossito", "Tori-Avamè", "Tori-Cada", "Tori-Gare", "Tori-Bossito Centre"]
            },
            {
                name: "Zè",
                arrondissements: ["Zè", "Adjan", "Dawé", "Djigbé", "Dodji-Bata", "Hèkanmè", "Kpédékpo", "Kpomassè", "Sèdjè-Dénou", "Sèdjè-Houégoudo", "Tangbo-Djevié", "Yokpo", "Zoungbomè"]
            }
        ]
    },
    {
        name: "Borgou",
        communes: [
            {
                name: "Bembèrèkè",
                arrondissements: ["Bembèrèkè", "Béroubouay", "Bouanri", "Gamia", "Ina"]
            },
            {
                name: "Kalalé",
                arrondissements: ["Kalalé", "Basso", "Bétérou", "Gbégourou", "Pèrèrè"]
            },
            {
                name: "N'Dali",
                arrondissements: ["N'Dali", "Bori", "Gbégourou", "Gnonkourakali", "Ouenou", "Sirarou"]
            },
            {
                name: "Nikki",
                arrondissements: ["Nikki", "Biro", "Gnonkourakali", "Ouénou", "Sérékalé", "Suya", "Tasso"]
            },
            {
                name: "Parakou",
                arrondissements: ["Parakou I", "Parakou II", "Parakou III", "Gbégourou", "Guèma", "Kpébié"]
            },
            {
                name: "Pèrèrè",
                arrondissements: ["Pèrèrè", "Gnèkpétin", "Kabanou", "Sontou"]
            },
            {
                name: "Sinendé",
                arrondissements: ["Sinendé", "Alafiarou", "Baka", "Bétérou", "Dérassi", "Koka", "Djékro"]
            },
            {
                name: "Tchaourou",
                arrondissements: ["Tchaourou", "Bétérou", "Goro", "Kika", "Sanson"]
            }
        ]
    },
    {
        name: "Collines",
        communes: [
            {
                name: "Bantè",
                arrondissements: ["Bantè", "Akpassi", "Bobè", "Gouka", "Lougba", "Pira"]
            },
            {
                name: "Dassa-Zoumè",
                arrondissements: ["Dassa I", "Dassa II", "Gbaffo", "Kéré", "Lèma", "Paouingnan", "Tré"]
            },
            {
                name: "Glazoué",
                arrondissements: ["Glazoué", "Assanté", "Akiza", "Gomè", "Kpakpaza", "Magoumi", "Ouèdèmè", "Sokponta", "Thio", "Zaffé"]
            },
            {
                name: "Ouèssè",
                arrondissements: ["Ouèssè", "Atokolibè", "Kilibo", "Lafirou", "Manigri", "Monkassa", "Tchaada"]
            },
            {
                name: "Savalou",
                arrondissements: ["Savalou", "Agnigbé", "Attakè", "Doumè", "Gobè", "Logozohè", "Okou", "Ottola", "Tchetti"]
            },
            {
                name: "Savè",
                arrondissements: ["Savè", "Agnignan", "Bessassi", "Djagbalo", "Kaboua", "Lahotan", "Offè", "Ouèssènè", "Okounfo-Agbado"]
            }
        ]
    },
    {
        name: "Couffo",
        communes: [
            {
                name: "Aplahoué",
                arrondissements: ["Aplahoué", "Atomè", "Azovè", "Dekpo", "Godonou", "Kissamey", "Lonkly"]
            },
            {
                name: "Djakotomey",
                arrondissements: ["Djakotomey", "Adjahomey", "Ayomi", "Gbaffo", "Gohomey", "Kokohoué", "Koussoukpa", "Soclogbo"]
            },
            {
                name: "Dogbo",
                arrondissements: ["Dogbo", "Ayahohoué", "Dévé", "Honton", "Locohouè", "Madjrè", "Totchagbé"]
            },
            {
                name: "Klouékanmè",
                arrondissements: ["Klouékanmè", "Adjahonmey", "Adoucodji", "Agbon", "Démé", "Djotto", "Hondjin", "Lanta", "Tchikpé"]
            },
            {
                name: "Lalo",
                arrondissements: ["Lalo", "Adohoun", "Ahohon", "Banigbé", "Batanvi", "Bessè", "Gbèdjromèdé", "Gnizounmè", "Lokpodji", "Tchito", "Tohou", "Zalli"]
            },
            {
                name: "Toviklin",
                arrondissements: ["Toviklin", "Adingningon", "Cana I", "Cana II", "Coussi", "Houin-Agamè"]
            }
        ]
    },
    {
        name: "Donga",
        communes: [
            {
                name: "Bassila",
                arrondissements: ["Bassila", "Adja Ouèrè", "Biguina", "Manigri", "Pénéssoulou"]
            },
            {
                name: "Copargo",
                arrondissements: ["Copargo", "Birni", "Djougou-Copargo", "Kparakô", "Nadoba"]
            },
            {
                name: "Djougou",
                arrondissements: ["Djougou I", "Djougou II", "Djougou III", "Barei", "Kolokondé", "Onklou", "Patargo", "Pélébina", "Sérou"]
            },
            {
                name: "Ouaké",
                arrondissements: ["Ouaké", "Awanlin", "Badjoudè", "Sèmèrè", "Tchalinga"]
            }
        ]
    },
    {
        name: "Littoral",
        communes: [
            {
                name: "Cotonou",
                arrondissements: ["Cotonou 1er", "Cotonou 2ème", "Cotonou 3ème", "Cotonou 4ème", "Cotonou 5ème", "Cotonou 6ème", "Cotonou 7ème", "Cotonou 8ème", "Cotonou 9ème", "Cotonou 10ème", "Cotonou 11ème", "Cotonou 12ème", "Cotonou 13ème"]
            }
        ]
    },
    {
        name: "Mono",
        communes: [
            {
                name: "Athiémé",
                arrondissements: ["Athiémé", "Dédomè", "Kpinnou"]
            },
            {
                name: "Bopa",
                arrondissements: ["Bopa", "Lobogo", "Ouèdèmè-Adja", "Yégodoé"]
            },
            {
                name: "Comè",
                arrondissements: ["Comè", "Akodéha", "Agatogbo", "Gbéhoué", "Ouèdèmè-Pédah"]
            },
            {
                name: "Grand-Popo",
                arrondissements: ["Grand-Popo", "Agoué", "Avloh", "Sè"]
            },
            {
                name: "Houéyogbé",
                arrondissements: ["Houéyogbé", "Doutou", "Gbakpodji", "Houéyogbé Agamè"]
            },
            {
                name: "Lokossa",
                arrondissements: ["Lokossa", "Colli-Agatogbo", "Houin", "Ouédémè-Agamè"]
            }
        ]
    },
    {
        name: "Ouémé",
        communes: [
            {
                name: "Adjarra",
                arrondissements: ["Adjarra", "Aglogbè", "Honvié", "Malanhoui", "Médédjonou"]
            },
            {
                name: "Adjohoun",
                arrondissements: ["Adjohoun", "Akpadanou", "Awonou", "Azowlissè", "Démè", "Gangban", "Kodonou", "Togbota"]
            },
            {
                name: "Aguégués",
                arrondissements: ["Aguégués", "Avagbodji", "Zoungamè"]
            },
            {
                name: "Akpro-Missérété",
                arrondissements: ["Akpro-Missérété", "Golo-Djigbé", "Katagon", "Vakon", "Zoungbomè"]
            },
            {
                name: "Avrankou",
                arrondissements: ["Avrankou", "Atchonsa", "Djèrègbé", "Gbodjo", "Ouanho", "Sado"]
            },
            {
                name: "Bonou",
                arrondissements: ["Bonou", "Affamè", "Aho", "Damè-Wogon", "Houinvigué"]
            },
            {
                name: "Dangbo",
                arrondissements: ["Dangbo", "Dékin", "Gbéko", "Hounviguè", "Ouèdèmè-Adja", "Zounguè"]
            },
            {
                name: "Porto-Novo",
                arrondissements: ["Porto-Novo I", "Porto-Novo II", "Porto-Novo III", "Porto-Novo IV", "Porto-Novo V", "Djègbadji"]
            },
            {
                name: "Sèmè-Kpodji",
                arrondissements: ["Sèmè-Kpodji", "Agblangandan", "Aïdjèdo", "Djrègbé", "Sékou", "Tohouè"]
            }
        ]
    },
    {
        name: "Plateau",
        communes: [
            {
                name: "Adja-Ouèrè",
                arrondissements: ["Adja-Ouèrè", "Kpoulou", "Massè", "Oko-Akare", "Totchan-Ibèkè"]
            },
            {
                name: "Ifangni",
                arrondissements: ["Ifangni", "Banigbé", "Daagbé", "Lagbé", "Tchaada"]
            },
            {
                name: "Kétou",
                arrondissements: ["Kétou", "Adakplamè", "Idigny", "Idigny-Centre", "Itakè", "Mowodani"]
            },
            {
                name: "Pobè",
                arrondissements: ["Pobè", "Akoudjin", "Issaba", "Issaba-Centre", "Igana", "Towé"]
            },
            {
                name: "Sakété",
                arrondissements: ["Sakété", "Agbogoun", "Ikpinlè", "Takon", "Yoko"]
            }
        ]
    },
    {
        name: "Zou",
        communes: [
            {
                name: "Abomey",
                arrondissements: ["Abomey", "Détohou", "Djègbé", "Hounli", "Ouakpè-Daho", "Passagon", "Ouèdo", "Sama", "Vidolè"]
            },
            {
                name: "Agbangnizoun",
                arrondissements: ["Agbangnizoun", "Adingningon", "Kinta", "Lissazounmè", "Sahé", "Sindomè", "Soli", "Tanvè", "Zounzounmè"]
            },
            {
                name: "Bohicon",
                arrondissements: ["Bohicon", "Agongointo", "Avogbana", "Gnidjazoun", "Lissèzoun", "Ouassaho", "Passagon", "Sodohomè"]
            },
            {
                name: "Cové",
                arrondissements: ["Cové", "Dèkanmè", "Houin-Dékpon", "Houègbo", "Houin-Zou", "Lainta", "Soli", "Zoungoudo"]
            },
            {
                name: "Djidja",
                arrondissements: ["Djidja", "Agondji", "Agouna", "Dan", "Kinkinhoué", "Monsourou", "Mougnon", "Oumbèga", "Sètro"]
            },
            {
                name: "Ouinhi",
                arrondissements: ["Ouinhi", "Dasso", "Sagon", "Tohou"]
            },
            {
                name: "Za-Kpota",
                arrondissements: ["Za-Kpota", "Allahé", "Assanté", "Cana", "Dawé", "Kpota", "Kpoguidi", "Tanmé-Dédomè", "Zoukou"]
            },
            {
                name: "Zagnanado",
                arrondissements: ["Zagnanado", "Agonlin-Houégbo", "Bokounon", "Dovi", "Kpataba", "Koudjinmè", "Kpédékpo", "Sodjatinmè", "Tannou-Gola", "Zinvié"]
            },
            {
                name: "Zogbodomey",
                arrondissements: ["Zogbodomey", "Avlamè", "Cové-Djigbé", "Koussoukpa", "Kpokissa", "Tangbo", "Tannou", "Zoukou"]
            }
        ]
    }
];

// Helper function to get all communes for a département
export const getCommunesByDepartement = (departementName: string): Commune[] => {
    const dept = BENIN_LOCATIONS.find(d => d.name === departementName);
    return dept?.communes || [];
};

// Helper function to get all arrondissements for a commune
export const getArrondissementsByCommune = (departementName: string, communeName: string): string[] => {
    const dept = BENIN_LOCATIONS.find(d => d.name === departementName);
    const commune = dept?.communes.find(c => c.name === communeName);
    return commune?.arrondissements || [];
};

// Get all département names for select
export const getAllDepartements = (): string[] => {
    return BENIN_LOCATIONS.map(d => d.name);
};

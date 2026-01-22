# How to use

### Web service primary URL:
https://pokemonwebservice.onrender.com

### Retrieve all cards:
https://pokemonwebservice.onrender.com/allpokemon
![/allpokemon](/images/allpokemon.png)

### Add card:
https://pokemonwebservice.onrender.com/addpokemon

**{"pokemon_name": "Absol", "pokemon_type": "Dark", "pokemon_pic": "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/359.png"}**
![](/images/addpokemon.gif)

### Update card using PUT:
https://pokemonwebservice.onrender.com/updatepokemon/5

**{
  "idpokemon": 3,
  "pokemon_name": "Pikachu",
  "pokemon_type": "Electric",
  "pokemon_pic": "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/025.png"
}**
![](/images/updatepokemon.gif)

### Delete card using GET:
https://pokemonwebservice.onrender.com/deletepokemon/5
![](/images/getdeletepokemon.gif)

### Delete card using PUT:
https://pokemonwebservice.onrender.com/deletepokemon/5

**{"idpokemon": 1}**
![](/images/postdeletepokemon.gif)




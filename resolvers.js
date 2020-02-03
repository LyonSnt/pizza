// INICIO AGREGADO EL 13-01-2020
import { execute } from "graphql";

const { db } = require("./conexionPGSQL");

const pizzaResolver = {
  Query: {
    pizzas(root, { name }) {
      if (name === undefined) {
        return executeQuery("select * from pizza", "");
      }
      return executeQuery("select * from pizza where name=$1", name);
    },
    pizzaId(root, { id }) {
      return executeQuery("select * from pizza where id=$1", id);
    }
  }, //Esta consulta esta por que la tabla pizza e ingredient esta relacionado y se pone a afuera del Query general.
  Pizza: {
    //es del schema el metodo Pizza
    ingredients(pizzaParam) {
      // const query = 'select ingredient.* from pizza_ingredients, ingredient where pizza_ingredients.ingredient_id = ingredient.id and pizza_ingredients.pizza_id = $1';
      const query = `select b.* 
                           from pizza a, ingredient b ,pizza_ingredients c
                           where a.id = c.pizza_id 
                           and c.ingredient_id = b.id 
                           and c.pizza_id = $1`;

      return executeQuery(query, pizzaParam.id);
    }
  },

  //INICIO CREADO EL 20-01-2020

  // estamos creando un metodo de insercion a la tabla pizza
  Mutation: {
    // createPizza (root, {pizza}){
    //asincrona.- estoy diciendo que me devuelva no una promesa sino un dato
    async createPizza(root, { pizza }) {
      if (pizza === undefined) return null;
      const query =
        "INSERT INTO pizza(name, origin) VALUES ($1,$2) returning *;"; //estoy diciendo que me retorne todo
      //let res = db.one(query, [pizza.name, pizza.origin]); //solo retorno una sentencia
      let res = await db.one(query, [pizza.name, pizza.origin]);

      //Insertar detalle de ingredientes
      if (res.id && pizza.ingredientIds && pizza.ingredientIds.length > 0) {
        pizza.ingredientIds.forEach(ingredientId => {
          const query =
            "INSERT INTO pizza_ingredients(pizza_id, ingredient_id) VALUES ($1,$2) returning *;";
          executeQuery(query, [res.id, ingredientId]);
        });
      }

      return res;
    },

    async updatePizza(root, { pizza }) {
      if (pizza === undefined) return null;
      const query =
        "update pizza set name = $2, origin=$3  WHERE id = 1 returning *;";
      //UPDATE pizza SET name = 'hhaha', origin = 'yaya' WHERE id = 171;
      let res = await db.one(query, [pizza.id, pizza.name, pizza.origin]);

      // executeQuery('delete from pizza_ingredients where pizza_id=$1', [res.id])

      if (res.id && pizza.ingredientIds && pizza.ingredientIds.length > 0) {
        pizza.ingredientIds.forEach(ingredientId => {
          const query =
            "INSERT INTO pizza_ingredients(pizza_id, ingredient_id) VALUES ($1,$2) returning *;";
          executeQuery(query, [res.id, ingredientId]);
        });
      }
      return res;
    },

    async deletePizza(root, { id }) {
      if (id === undefined) return null
      executeQuery("delete from pizza_ingredients where pizza_id=$1;", [id]);
      const query = "delete from pizza WHERE id = $1 returning *;";
      let res = await db.one(query, [id]);
      return res;
    }
  }

  //FIN CREADO EL 20-01-2020
};

async function executeQuery(query, parameters) {
  let recorset = await db
    .any(query, parameters)
    .then(res => res)
    .catch(err => err);
  return recorset;
}

export default pizzaResolver;

// FIN AGREGADO EL 13-01-2020

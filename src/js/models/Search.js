import axios from 'axios';

export default class Search{
     constructor(query){
         this.query = query;
     }

    async getResults(){
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        // const key = '4e0f1f7c2a3eac969e6f86ff43ec9336'; my
        const key = '767de86f8ea74854742098dacb4e2271';
    
        try{
            const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
        } catch(error) {
            console.log(error);
        }
    
    }
}

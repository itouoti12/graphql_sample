export const GRAPHQL_URL = "http://localhost:4000/graphql";

const DICE = 3
const SIDES = 6
export const GET_DICE_REQ = {
    method:"POST",
    headers:{
        "Content-Type":"application/json",
        Accept: "application/json"
    },
    body:JSON.stringify({
        query:`
            query RollDice($dice: Int!, $sides: Int){
                rollDice(numDice: $dice, numSides: $sides)
            }
        `,
        variables:{dice: DICE,sides: SIDES},
    })
}

export const CREATE_USER = {
    method:"POST",
    headers:{
        "Content-Type":"application/json",
        Accept: "application/json"
    },
    body:JSON.stringify({
        query: `
            mutation{
                createMessage(input: {
                    author: "andy",
                    content: "hope is a good thing",
                }) {
                    id
                }
            }
        `
    })
}

export const SEARCH_USER = (id:string) => ({
    method:"POST",
    headers:{
        "Content-Type":"application/json",
        Accept: "application/json"
    },
    body:JSON.stringify({
        query: `
            query{
                getMessage(id:"${id}"){
                    author
                }
            }
        `
    })
});


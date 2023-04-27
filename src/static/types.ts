export type PlayerType = {
    id: string,
    name : string, 
    surname : string, 
    city : string,
    age : number,
    registerDate : number,
    isEditing? : boolean
}
export type PlayerToAddType = {
    name : string, 
    surname : string, 
    city : string,
    age : number,
}
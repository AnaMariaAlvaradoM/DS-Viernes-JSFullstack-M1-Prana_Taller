const clases = [
    {id:1,nombre:"Hatha suave",intructora: "Lucía Ortiz",horario: "Lunes 7:00 a. m.",cupo: 15},
    {id:2,nombre:"Hatha",intructora: "Lucía Ortiz",horario: "Lunes 8:00 a. m.",cupo: 9},
    {id:3,nombre:"Vinyasa",intructora: "Lucía Ortiz",horario: "Lunes 9:00 a. m.",cupo: 10},
    {id:4,nombre:"Hatha suave",intructora: "Lucía Ortiz",horario: "Martes 7:00 a. m.",cupo: 11},
    {id:5,nombre:"Hatha",intructora: "Lucía Ortiz",horario: "Martes 8:00 a. m.",cupo: 13},
    {id:6,nombre:"Vinyasa",intructora: "Lucía Ortiz",horario: "Martes 9:00 a. m.",cupo: 12}
];

export function listar(){return clases;}

export function findbyId(id){return clases.find((c)=>c.id === id);}

interface Subject {
    title:string;            
    createdAt:number;            
}

export const SUBJECT_SEED: Subject[] = [
    {
        title:'Literatura',
        createdAt: new Date().getTime()
    },
]
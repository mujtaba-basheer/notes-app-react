import { create, StateCreator } from "zustand";
import { persist, devtools } from "zustand/middleware";

type UserT = {
    fname: string;
    _id: string;
    token: string;
};
type NoteT = {
    title: string;
    description: string;
    priority: number;
    _id: string;
};
interface StateI {
    user: UserT | null;
    setUser: (user: UserT) => void;
    logoutUser: () => void;
    notes: NoteT[];
    setNotes: (notes: NoteT[]) => void;
    deleteNote: (id: string) => void;
    shiftNotes: (index: number, direction: "L" | "R") => void;
}

const store: StateCreator<StateI> = (set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logoutUser: () => set({ user: null }),
    notes: [],
    // @ts-ignore
    setNotes: (notes) => set({ notes }, false, "setNotes"),
    deleteNote: (id) => set((store) => {
        const note = store.notes.find(note => note._id === id);
        if (note) {
            return {
                notes: store.notes.filter(n => n._id !== id).map(n => {
                    const p = n.priority;
                    if (p > note.priority) n.priority = p - 1;
                    return n;
                })
            };
        }

        return { notes: store.notes };
        // @ts-ignore
    }, false, "deleteNote"),
    shiftNotes: (index, direction) => set((state) => {
        console.log({ index });
        const notes = [...state.notes];
        if (direction === "L") {
            if (index !== 0) {
                const temp = notes[index - 1];
                temp.priority--;
                notes[index].priority++;
                notes[index - 1] = notes[index];
                notes[index] = temp;
            }
        } else if (direction === "R") {
            if (index < notes.length - 1) {
                const temp = notes[index + 1];
                temp.priority++;
                notes[index].priority--;
                notes[index + 1] = notes[index];
                notes[index] = temp;
            }
        }
        return { notes };
        // @ts-ignore
    }, false, "shiftNotes")
});

export const useStore = create<StateI, [["zustand/devtools", never], ["zustand/persist", StateI]]>(devtools(persist(store, { name: "store" })));

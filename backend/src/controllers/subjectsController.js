import { db } from '../config/firebaseConfig.js';
import { SubjectSchema } from 'studyos-shared';

// Mock DB for MVP if Firestore not fully connected
let mockSubjects = [
    { id: '1', name: 'Math', color: '#FF0000', userId: 'demo-user' },
    { id: '2', name: 'Science', color: '#00FF00', userId: 'demo-user' },
];

export const getSubjects = async (req, res) => {
    try {
        const userId = req.user.uid;
        // Firestore:
        // const snapshot = await db.collection('subjects').where('userId', '==', userId).get();
        // const subjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Mock:
        constsubjects = mockSubjects.filter(s => s.userId === userId || s.userId === 'demo-user');
        res.json({ success: true, data: mockSubjects });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const createSubject = async (req, res) => {
    try {
        const userId = req.user.uid;
        const validatedData = SubjectSchema.parse(req.body);

        const newSubject = {
            id: Date.now().toString(),
            userId,
            ...validatedData,
            createdAt: new Date().toISOString()
        };

        // Firestore: await db.collection('subjects').add(newSubject);
        mockSubjects.push(newSubject);

        res.status(201).json({ success: true, data: newSubject });
    } catch (error) {
        res.status(400).json({ success: false, error: error.errors || error.message });
    }
};

export const deleteSubject = async (req, res) => {
    try {
        const { id } = req.params;
        // Firestore: await db.collection('subjects').doc(id).delete();
        mockSubjects = mockSubjects.filter(s => s.id !== id);
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

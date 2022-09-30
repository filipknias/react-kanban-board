export const formatFirebaseError = (message: string) => {
  switch (message) {
    case 'auth/email-already-in-use': return "Email already in use";
    case 'auth/weak-password': return "Password should be at least 6 characters";
    case 'auth/invalid-email': return "Email should be valid address";
    case 'auth/wrong-password': return "Wrong email or password";
    case 'auth/user-not-found': return "Wrong email or password";
    default: return "Something went wrong";
  }
};
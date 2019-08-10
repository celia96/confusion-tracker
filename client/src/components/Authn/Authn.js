// Helper class for storing user profile in the sessionStorage
class Authn {
  static async isAuthn() {
    return !!window.sessionStorage.getItem('profile');
  }

  static logout() {
    window.sessionStorage.removeItem('profile');
  }

  static saveProfile(profile) {
    // Session storage must be a string
    window.sessionStorage.setItem('profile', JSON.stringify(profile));
  }

  static getProfile() {
    return JSON.parse(window.sessionStorage.getItem('profile'));
  }
}

export default Authn;

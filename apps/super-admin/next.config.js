/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  async rewrites() {
    return [
      // Événements
      {
        source: '/%C3%89v%C3%A9nements',
        destination: '/evenements',
      },
      {
        source: '/\u00c9v\u00e9nements', // NFC (composed Événements)
        destination: '/evenements',
      },
      {
        source: '/E\u0301ve\u0301nements', // NFD (decomposed Événements)
        destination: '/evenements',
      },
      {
        source: '/Evenements',
        destination: '/evenements',
      },
      {
        source: '/evenements',
        destination: '/evenements',
      },

      // Activité
      {
        source: '/Activit%C3%A9',
        destination: '/activite',
      },
      {
        source: '/Activit\u00e9', // NFC (composed Activité)
        destination: '/activite',
      },
      {
        source: '/Activite\u0301', // NFD (decomposed Activité)
        destination: '/activite',
      },
      {
        source: '/Activite',
        destination: '/activite',
      },
      {
        source: '/activite',
        destination: '/activite',
      },

      // Paramètres
      {
        source: '/Param%C3%A8tres',
        destination: '/parametres',
      },
      {
        source: '/Param\u00e8tres', // NFC (composed Paramètres)
        destination: '/parametres',
      },
      {
        source: '/Parame\u0300tres', // NFD (decomposed Paramètres)
        destination: '/parametres',
      },
      {
        source: '/Parametres',
        destination: '/parametres',
      },
      {
        source: '/parametres',
        destination: '/parametres',
      },

      // Utilisateurs
      {
        source: '/Utilisateurs',
        destination: '/utilisateurs',
      },
      {
        source: '/utilisateurs',
        destination: '/utilisateurs',
      },
    ];
  },
};

module.exports = nextConfig;


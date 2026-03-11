export default function Users() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">Usuários</h1>
        <p className="text-gray-600">Gerencie os usuários da plataforma</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-600 mb-4">
          Gerenciamento de usuários disponível no Django Admin
        </p>
        <a
          href="http://localhost:8000/admin/authentication/customuser/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-ocean text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
        >
          Abrir Django Admin
        </a>
      </div>
    </div>
  );
}

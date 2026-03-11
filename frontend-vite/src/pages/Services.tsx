import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hotel, Utensils, Car, Map, ArrowRight } from 'lucide-react';

const services = [
  {
    title: 'Acomodação',
    icon: Hotel,
    description: 'Encontre os melhores hotéis, pousadas e casas de hóspedes em Inhambane.',
    color: 'bg-blue-100 text-blue-600',
    link: '/explore?categoria=hotel,pousada'
  },
  {
    title: 'Restaurantes',
    icon: Utensils,
    description: 'Descubra a culinária local e os melhores restaurantes.',
    color: 'bg-orange-100 text-orange-600',
    link: '/explore?categoria=restaurante'
  },
  {
    title: 'Transporte',
    icon: Car,
    description: 'Serviços de táxi confiáveis, aluguel de carros e transfers.',
    color: 'bg-green-100 text-green-600',
    link: '/explore'
  },
  {
    title: 'Tours Guiados',
    icon: Map,
    description: 'Explore com guias locais experientes que conhecem as joias escondidas.',
    color: 'bg-purple-100 text-purple-600',
    link: '/explore?categoria=atracao,cultura'
  },
];

export default function Services() {
  const navigate = useNavigate();

  return (
    <div className="bg-sand min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-heading font-bold text-ocean mb-4">Nossos Serviços</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Tudo o que você precisa para uma viagem perfeita a Inhambane, tudo em um só lugar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 group cursor-pointer"
              onClick={() => navigate(service.link)}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${service.color}`}>
                <service.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-6">{service.description}</p>
              <button className="flex items-center text-ocean font-bold text-sm group-hover:gap-2 transition-all">
                Explorar <ArrowRight size={16} className="ml-1" />
              </button>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-20 bg-tropical rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Pronto para planejar sua viagem?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Deixe nosso guia com IA ajudá-lo a criar um itinerário personalizado baseado em seus interesses e orçamento.
            </p>
            <button 
              onClick={() => navigate('/explore')}
              className="bg-sun text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-orange-600 transition-colors shadow-lg"
            >
              Começar a Planejar Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

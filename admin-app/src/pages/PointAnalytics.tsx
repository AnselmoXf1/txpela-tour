import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Heart, Bookmark, MessageCircle, Share2, Tr';
import { pontosService } from '../services/api';
import type { PontoTuristico } from '../types';
import AnalyticsCard from '../components/AnalyticsCard';
import PointPreview from '../components/PointPreview';

export default function PointAnalytics() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [point, setPoint] = useState<PontoTuristico | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'feed' | 'explore'>('feed');

  useEffect(() => {
    if (id) {
      loadPoint(id);
    }
  }, [id]);

  const loadPoint = async (pointId: string) => {
    try {
      const response = await pontosService.getById(pointId);
      setPoint(response.data);
    } catch (err) {
      console.error('Erro ao carregar ponto:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageRating = () => {
    if (!point?.reviews || point.reviews.length === 0
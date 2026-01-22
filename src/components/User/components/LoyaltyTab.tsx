import React, { useState, useEffect } from 'react';
import { Star, Lock, CheckCircle, TrendingUp, History, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/useApp';
import { httpClient } from '@/services/httpClient';

interface LoyaltyData {
  points: number;
  pointsValue: number;
  canUsePoints: boolean;
  progressPercentage: number;
  pointsToNextThreshold: number;
  nextThresholdValue: number;
}

interface LoyaltyHistory {
  id: number;
  type: 'GAIN' | 'UTILISATION';
  points: number;
  amount: number;
  description: string;
  orderNumber?: string;
  date: string;
}

export function LoyaltyTab() {
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null);
  const [history, setHistory] = useState<LoyaltyHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');

  useEffect(() => {
    loadLoyaltyData();
  }, []);

  const loadLoyaltyData = async () => {
    try {
      setLoading(true);
      console.log('Tentative de chargement des données de fidélité...');
      console.log('Token disponible:', httpClient.hasToken());

      const [pointsResponse, historyResponse] = await Promise.all([
        httpClient.get<LoyaltyData>('/api/loyalty/points'),
        httpClient.get<LoyaltyHistory[]>('/api/loyalty/history')
      ]);

      console.log('Réponse points brute:', pointsResponse);
      console.log('Réponse historique brute:', historyResponse);

      if (pointsResponse.status === 'success') {
        setLoyaltyData(pointsResponse.data);
      } else {
        console.error('Erreur API points:', pointsResponse);
      }

      if (historyResponse.status === 'success') {
        setHistory(historyResponse.data);
      } else {
        console.error('Erreur API historique:', historyResponse);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données de fidélité:', error);
      console.error('Détails de l\'erreur:', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!loyaltyData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Impossible de charger les données de fidélité</p>
        <p className="text-sm text-muted-foreground mt-2">
          Vérifiez que vous êtes connecté et que le serveur fonctionne.
        </p>
        <button
          onClick={loadLoyaltyData}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Programme de Fidélité</h3>
        <p className="text-muted-foreground">
          Accumulez des points et bénéficiez de réductions sur vos commandes
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border">
        {[
          { id: 'overview' as const, label: 'Aperçu', icon: Star },
          { id: 'history' as const, label: 'Historique', icon: History }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center space-x-2 py-3 px-6 transition-colors',
                activeTab === tab.id
                  ? 'border-b-2 border-primary text-primary bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Points Balance Card */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {/* <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-primary-foreground" />
                </div> */}
                <div>
                  <h4 className="text-xl font-bold">Mes Points</h4>
                  {/* <p className="text-muted-foreground">Équivalent: {loyaltyData.pointsValue.toLocaleString()} F</p> */}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">{loyaltyData.points.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">points</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all duration-500"
                  style={{ width: `${loyaltyData.progressPercentage}%` }}
                ></div>
              </div>
              {loyaltyData.points < 100 && (
                <p className="text-sm text-muted-foreground">
                  Encore {loyaltyData.pointsToNextThreshold.toFixed(2)} points pour débloquer votre remise
                </p>
              )}
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-background border border-border rounded-xl p-6">
            <div className="flex items-center space-x-4">
              {loyaltyData.canUsePoints ? (
                <>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-600 dark:text-green-400">
                      Remise Disponible !
                    </h4>
                    <p className="text-muted-foreground">
                      Vous pouvez utiliser vos points pour une remise de {loyaltyData.pointsValue.toLocaleString()} F
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    <Lock className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Remise Verrouillée</h4>
                    <p className="text-muted-foreground">
                      Accumulez encore {loyaltyData.pointsToNextThreshold.toFixed(2)} points pour débloquer 1500 F de remise et plus !
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* How it works */}
          <div className="bg-muted/50 rounded-xl p-6">
            <h4 className="font-semibold mb-4 flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Comment ça marche ?</span>
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">1</div>
                <p>Pour chaque commande, gagnez 0,03% du montant TTC en points</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">2</div>
                <p>1 point = 15 F de remise</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">3</div>
                <p>À partir de 100 points (1500 F), utilisez vos points sur vos commandes</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-4">
          <h4 className="font-semibold flex items-center space-x-2">
            <History className="h-5 w-5" />
            <span>Historique des Points</span>
          </h4>

          {history.length === 0 ? (
            <div className="text-center py-12">
              <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun historique disponible</p>
              <p className="text-sm text-muted-foreground">Vos points apparaîtront ici après vos premières commandes</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 bg-background border border-border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      entry.type === 'GAIN'
                        ? "bg-green-100 dark:bg-green-900"
                        : "bg-red-100 dark:bg-red-900"
                    )}>
                      {entry.type === 'GAIN' ? (
                        <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <Gift className="h-5 w-5 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{entry.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString('fr-FR')}
                        {entry.orderNumber && ` • Commande #${entry.orderNumber}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn(
                      "font-bold",
                      entry.type === 'GAIN' ? "text-green-600" : "text-red-600"
                    )}>
                      {entry.type === 'GAIN' ? '+' : ''}{entry.points.toFixed(2)} pts
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {entry.amount.toLocaleString()} F
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
// src/store/tournamentStore.ts
import { defineStore } from 'pinia';
import type { Principal } from '@dfinity/principal';
import { useAuthStore } from './auth';
import type { Tournament as BackendTournament, Match as BackendMatch, _SERVICE as TournamentsService } from '@/declarations/tournaments/tournaments.did';

interface Match extends BackendMatch {
  participants: Principal[];
}

interface Tournament extends BackendTournament {
  participants: Principal[];
  registeredParticipants: Principal[];
}

interface TournamentBracket {
  matches: Match[];
}

export const useTournamentStore = defineStore('tournament', {
  state: () => ({
    tournaments: [] as Tournament[],
    activeTournaments: [] as Tournament[],
    inactiveTournaments: [] as Tournament[],
    tournamentBracket: { matches: [] } as TournamentBracket,
    users: [] as Principal[],
    matches: [] as Match[],
  }),
  actions: {
    async fetchAllTournaments() {
      const authStore = useAuthStore();
      const tournaments = authStore.tournaments;
      if (!tournaments) {
        throw new Error("Tournaments service is not initialized");
      }
      try {
        const fetchedTournaments = await tournaments.getAllTournaments();
        this.tournaments = fetchedTournaments ? [...fetchedTournaments] : [];
        console.log('Fetched Tournaments:', fetchedTournaments);
      } catch (error) {
        console.error('Error fetching all tournaments:', error);
      }
    },
    async fetchActiveTournaments() {
      const authStore = useAuthStore();
      const tournaments = authStore.tournaments;
      if (!tournaments) {
        throw new Error("Tournaments service is not initialized");
      }
      try {
        const activeTournaments = await tournaments.getActiveTournaments();
        this.activeTournaments = activeTournaments ? [...activeTournaments] : [];
        console.log('Fetched Active Tournaments:', activeTournaments);
      } catch (error) {
        console.error('Error fetching active tournaments:', error);
      }
    },
    async fetchInactiveTournaments() {
      const authStore = useAuthStore();
      const tournaments = authStore.tournaments;
      if (!tournaments) {
        throw new Error("Tournaments service is not initialized");
      }
      try {
        const inactiveTournaments = await tournaments.getInactiveTournaments();
        this.inactiveTournaments = inactiveTournaments ? [...inactiveTournaments] : [];
        console.log('Fetched Inactive Tournaments:', inactiveTournaments);
      } catch (error) {
        console.error('Error fetching inactive tournaments:', error);
      }
    },
    async fetchTournamentBracket(tournamentId: bigint) {
      const authStore = useAuthStore();
      const tournaments = authStore.tournaments;
      if (!tournaments) {
        throw new Error("Tournaments service is not initialized");
      }
      try {
        const bracket = await tournaments.getTournamentBracket(tournamentId);
        this.tournamentBracket = bracket ? { matches: [...bracket.matches] } : { matches: [] };
        console.log('Fetched Tournament Bracket:', bracket);
      } catch (error) {
        console.error('Error fetching tournament bracket:', error);
      }
    },
    async fetchRegisteredUsers(tournamentId: bigint) {
      const authStore = useAuthStore();
      const tournaments = authStore.tournaments;
      if (!tournaments) {
        throw new Error("Tournaments service is not initialized");
      }
      try {
        const users = await tournaments.getRegisteredUsers(tournamentId);
        this.users = users ? [...users] : [];
        console.log('Fetched Registered Users:', users);
      } catch (error) {
        console.error('Error fetching registered users:', error);
      }
    },
    async joinTournament(tournamentId: bigint) {
      const authStore = useAuthStore();
      const tournaments = authStore.tournaments;
      if (!tournaments) {
        throw new Error("Tournaments service is not initialized");
      }
      try {
        return await tournaments.joinTournament(tournamentId);
      } catch (error) {
        console.error('Error joining tournament:', error);
        throw error;
      }
    },
    async createTournament(name: string, startDate: bigint, prizePool: string, expirationDate: bigint) {
      const authStore = useAuthStore();
      const tournaments = authStore.tournaments;
      if (!tournaments) {
        throw new Error("Tournaments service is not initialized");
      }
      try {
        return await tournaments.createTournament(name, startDate, prizePool, expirationDate);
      } catch (error) {
        console.error('Error creating tournament:', error);
        throw error;
      }
    },
    async updateBracket(tournamentId: bigint) {
      const authStore = useAuthStore();
      const tournaments = authStore.tournaments;
      if (!tournaments) {
        throw new Error("Tournaments service is not initialized");
      }
      try {
        return await tournaments.updateBracket(tournamentId);
      } catch (error) {
        console.error('Error updating bracket:', error);
        throw error;
      }
    },
    async adminUpdateMatch(tournamentId: bigint, matchId: bigint, winner: bigint, score: string) {
      const authStore = useAuthStore();
      const tournaments = authStore.tournaments;
      if (!tournaments) {
        throw new Error("Tournaments service is not initialized");
      }
      try {
        return await tournaments.adminUpdateMatch(tournamentId, matchId, winner, score);
      } catch (error) {
        console.error('Error updating match:', error);
        throw error;
      }
    },
    async submitFeedback(tournamentId: bigint, feedback: string) {
      const authStore = useAuthStore();
      const tournaments = authStore.tournaments;
      if (!tournaments) {
        throw new Error("Tournaments service is not initialized");
      }
      try {
        return await tournaments.submitFeedback(tournamentId, feedback);
      } catch (error) {
        console.error('Error submitting feedback:', error);
        throw error;
      }
    },
    async submitMatchResult(tournamentId: bigint, matchId: bigint, score: string) {
      const authStore = useAuthStore();
      const tournaments = authStore.tournaments;
      if (!tournaments) {
        throw new Error("Tournaments service is not initialized");
      }
      try {
        return await tournaments.submitMatchResult(tournamentId, matchId, score);
      } catch (error) {
        console.error('Error submitting match result:', error);
        throw error;
      }
    },
    async disputeMatch(tournamentId: bigint, matchId: bigint, reason: string) {
      const authStore = useAuthStore();
      const tournaments = authStore.tournaments;
      if (!tournaments) {
        throw new Error("Tournaments service is not initialized");
      }
      try {
        return await tournaments.disputeMatch(tournamentId, matchId, reason);
      } catch (error) {
        console.error('Error disputing match:', error);
        throw error;
      }
    },
    async deleteAllTournaments() {
      const authStore = useAuthStore();
      const tournaments = authStore.tournaments;
      if (!tournaments) {
        throw new Error("Tournaments service is not initialized");
      }
      try {
        return await tournaments.deleteAllTournaments();
      } catch (error) {
        console.error('Error deleting all tournaments:', error);
        throw error;
      }
    },
  },
});

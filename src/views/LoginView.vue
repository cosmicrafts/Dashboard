<template>
  <div class="main-div">
    <img src="@/assets/Cosmicrafts_Logo.svg" class="cosmic-logo-img" alt="Cosmicrafts Logo" />
    <label class="cosmic-label-connect">Connect with:</label>
    <div id="buttonDiv" class="google-button"></div>
    <div class="inner-div">
      <div class="btn-div" v-for="method in authMethods" :key="method.text" @click="method.onClick">
        <label class="btn-label">
          <img :src="method.logo" class="button-account-icon" :alt="method.text" />
          Login with {{ method.text }}
        </label>
      </div>
    </div>
    <div class="bottom-div">
      <img src="@/assets/wou_logo.svg" alt="wou-icon" class="bottom-wou-icon" />
      <label class="bottom-label">
        &copy;&nbsp;2023 World of Unreal<br />
        All trademarks referenced herein are the properties of their respective owners.
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import MetaMaskService from '@/services/MetaMaskService';
import PhantomService from '@/services/PhantomService';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import nacl from 'tweetnacl';
import { encode as base64Encode } from 'base64-arraybuffer';

// Import SVGs
import nfidLogo from '@/assets/NFID_logo.svg';
import icpLogo from '@/assets/icp_logo.svg';
import metaMaskLogo from '@/assets/metaMask_icon.svg';
import phantomLogo from '@/assets/Phantom_icon.svg';

const authStore = useAuthStore();
const router = useRouter();

const handleAfterLogin = () => {
  router.push({ name: 'Dashboard' });
};

const loadGoogleIdentityServices = () => {
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.onload = initializeGoogleSignIn;
  script.onerror = () => {
    setTimeout(loadGoogleIdentityServices, 1000);
  };
  document.body.appendChild(script);
};

const initializeGoogleSignIn = () => {
  window.google.accounts.id.initialize({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    callback: handleCredentialResponse,
  });
  window.google.accounts.id.renderButton(
    document.getElementById('buttonDiv'),
    { theme: 'filled_black', size: 'large' }
  );
  window.google.accounts.id.prompt();
};

const handleCredentialResponse = (response) => {
  authStore.loginWithGoogle(response, router).then(handleAfterLogin);
};

onMounted(() => {
  loadGoogleIdentityServices();
  // Check for existing session and handle redirection
  if (authStore.isAuthenticated) {
    handleAfterLogin();
  }
});

const generateKeysFromSignature = async (signature) => {
  const encoder = new TextEncoder();
  const encodedSignature = encoder.encode(signature);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', encodedSignature);
  const seed = new Uint8Array(hashBuffer.slice(0, 32));
  const keyPair = nacl.sign.keyPair.fromSeed(seed);

  const publicKeyBase64 = base64Encode(keyPair.publicKey);
  const privateKeyBase64 = base64Encode(keyPair.secretKey);

  authStore.createIdentity(publicKeyBase64, privateKeyBase64, router);
  authStore.isAuthenticated = true;
  handleAfterLogin();
};

const loginWithMetaMask = async () => {
  const uniqueMessage = 'Sign this message to log in with your Ethereum wallet';
  const signature = await MetaMaskService.signMessage(uniqueMessage);
  await generateKeysFromSignature(signature).then(handleAfterLogin);
};

const loginWithPhantom = async () => {
  const message = 'Sign this message to log in with your Phantom Wallet';
  const signature = await PhantomService.signAndSend(message);
  await generateKeysFromSignature(signature).then(handleAfterLogin);
};

const authMethods = [
  {
    logo: nfidLogo,
    text: 'NFID',
    onClick: () => authStore.loginWithNFID(router).then(handleAfterLogin),
  },
  {
    logo: icpLogo,
    text: 'Internet Identity',
    onClick: () => authStore.loginWithInternetIdentity(router).then(handleAfterLogin),
  },
  {
    logo: metaMaskLogo,
    text: 'MetaMask',
    onClick: loginWithMetaMask,
  },
  {
    logo: phantomLogo,
    text: 'Phantom',
    onClick: loginWithPhantom,
  },
];
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Ubuntu&display=swap');

body, .cosmic-label-connect, .btn-label, .bottom-label {
  font-family: 'Ubuntu', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.main-div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  text-align: center;
  overflow: hidden;
  background-image: url('@/assets/fondo.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.cosmic-logo-img {
  width: 200px;
  height: auto;
  margin-top: 4vh;
}

.cosmic-label-connect {
  color: #FFFFFF;
  font-weight: 600;
  margin: 16px 0px;
  font-size: 1.5rem;
}

.google-button {
  margin-bottom: 20px;
}

.inner-div {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
}

.btn-div {
  width: 100%;
  height: 48px;
  position: relative;
  background-image: url('@/assets/Boton_Inactivo.svg');
  cursor: pointer;
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: 0 20px;
}

.btn-div:hover {
  background-image: url('@/assets/activebtn.svg');
  transition: background-image 0.1s ease;
}

.button-account-icon {
  width: 24px;
  height: 24px;
  margin-right: 12px;
}

.btn-label {
  color: #FFFFFF;
  font-weight: 500;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.bottom-div {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.bottom-wou-icon {
  width: 50px;
}

.bottom-label {
  color: #aaaaaa;
  display: block;
  font-size: 0.875rem;
  text-align: center;
  margin-top: 10px;
}
</style>

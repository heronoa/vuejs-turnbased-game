<template>
  <div class="loading-circle">
  </div>
</template>

<style lang="css">
.loading-circle {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 10px solid transparent;
  border-top: 10px solid var(--loader-color);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: spin 1s linear infinite;
}

.loading-circle::after {
  content: "";
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid var(--loader-color);
  border-top: 2px solid transparent;
  animation: spin 3s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(180deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>

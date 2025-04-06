import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'

import { Box, ChakraProvider, defaultSystem } from '@chakra-ui/react';

import { Toaster } from './components/ui/toaster.jsx';
createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ChakraProvider value={defaultSystem}>

			<Toaster />
			<Box p={2}>
				<App />
			</Box>
		</ChakraProvider>
	</StrictMode>,
)

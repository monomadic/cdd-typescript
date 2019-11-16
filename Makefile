install:
	tsc main.ts
	rm -rf ~/.cdd/services/typescript
	cp -R ../cdd-typescript ~/.cdd/services/typescript
	echo '#!/bin/sh\nnode ~/.cdd/services/typescript/main.js $$@' > ~/.cdd/services/cdd-typescript
	chmod 777 ~/.cdd/services/cdd-typescript

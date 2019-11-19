install:
	tsc main.ts
	rm -rf ~/.cdd/bin/typescript
	cp -R ../cdd-typescript ~/.cdd/bin/typescript
	echo '#!/bin/sh\nnode ~/.cdd/bin/typescript/main.js $$@' > ~/.cdd/bin/cdd-typescript
	chmod 777 ~/.cdd/bin/cdd-typescript

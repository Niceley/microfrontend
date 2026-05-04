// L'import dynamique est obligatoire avec Module Federation :
// il crée une frontière de chunk qui permet à webpack de résoudre
// les shared modules (react singleton) avant d'exécuter quoi que ce soit.
import('./bootstrap');

import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col space-y-4 p-4">
      <Link href="/facture">
       
          Saisie facture
        
      </Link>
      <Link href="/saisieAcompte">
       
          Saisie acompte
        
      </Link>
      <Link href="/saisieAvoir">
        
          Saisie avoir
        
      </Link>
    </div>
  );
}

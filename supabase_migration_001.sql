-- ============================================================================
-- MIGRACIÓN: Nuevas tablas para TruequeYa
-- Ejecutar en: Supabase Dashboard → SQL Editor → New Query → Pegar y Run
-- Fecha: 2026-04-07
-- ============================================================================

-- ─── 1. TABLA: reviews ─────────────────────────────────────────────────────────
-- Sistema de valoraciones entre usuarios después de un trueque

CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    reviewer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    reviewed_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    proposal_id UUID REFERENCES public.proposals(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    
    -- Un usuario solo puede dejar una review por propuesta/trueque
    UNIQUE(reviewer_id, proposal_id)
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede leer las reviews (necesario para mostrar reputación)
CREATE POLICY "Reviews are viewable by everyone"
  ON public.reviews FOR SELECT USING (true);

-- Solo puedes crear reviews donde tú eres el reviewer
CREATE POLICY "Users can create their own reviews"
  ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Solo puedes editar tus propias reviews
CREATE POLICY "Users can update their own reviews"
  ON public.reviews FOR UPDATE USING (auth.uid() = reviewer_id);

-- Solo puedes borrar tus propias reviews
CREATE POLICY "Users can delete their own reviews"
  ON public.reviews FOR DELETE USING (auth.uid() = reviewer_id);


-- ─── 2. TABLA: saved_items ─────────────────────────────────────────────────────
-- Items guardados/favoritos por los usuarios

CREATE TABLE IF NOT EXISTS public.saved_items (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    
    PRIMARY KEY (user_id, product_id)
);

ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;

-- Cada usuario solo puede ver sus propios guardados
CREATE POLICY "Users can view their own saved items"
  ON public.saved_items FOR SELECT USING (auth.uid() = user_id);

-- Cada usuario solo puede guardar items como sí mismo
CREATE POLICY "Users can save items"
  ON public.saved_items FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Cada usuario solo puede des-guardar sus propios items
CREATE POLICY "Users can unsave items"
  ON public.saved_items FOR DELETE USING (auth.uid() = user_id);


-- ─── 3. MEJORAR RLS: proposals ─────────────────────────────────────────────────
-- La política actual permite que cualquier participante cambie el status a 
-- cualquier valor. Esta nueva política es más estricta.

-- Primero eliminar la política existente (si existe)
DROP POLICY IF EXISTS "Participants can update proposals" ON public.proposals;

-- El destinatario puede aceptar/rechazar propuestas pendientes
-- El remitente puede cancelar propuestas pendientes
CREATE POLICY "Controlled proposal status updates"
  ON public.proposals FOR UPDATE
  USING (
    auth.uid() IN (from_user_id, to_user_id)
    AND status = 'pending'  -- Solo se pueden modificar propuestas pendientes
  )
  WITH CHECK (
    CASE
      -- El destinatario puede aceptar o rechazar
      WHEN auth.uid() = to_user_id THEN status IN ('accepted', 'rejected')
      -- El remitente puede cancelar
      WHEN auth.uid() = from_user_id THEN status = 'cancelled'
      ELSE false
    END
  );


-- ─── 4. FUNCIÓN AUXILIAR: Calcular rating promedio de un usuario ────────────────

CREATE OR REPLACE FUNCTION public.calculate_user_rating(target_user_id UUID)
RETURNS TABLE(avg_rating NUMERIC, total_reviews BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0) AS avg_rating,
    COUNT(r.id) AS total_reviews
  FROM public.reviews r
  WHERE r.reviewed_id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ─── 5. TRIGGER: Actualizar rating del perfil cuando se crea una review ─────────

CREATE OR REPLACE FUNCTION public.update_profile_rating()
RETURNS trigger AS $$
DECLARE
  new_avg NUMERIC;
  new_count BIGINT;
BEGIN
  SELECT avg_rating, total_reviews 
  INTO new_avg, new_count
  FROM public.calculate_user_rating(NEW.reviewed_id);

  UPDATE public.profiles 
  SET rating = new_avg, total_reviews = new_count::INTEGER
  WHERE id = NEW.reviewed_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que se dispara al insertar o actualizar una review
DROP TRIGGER IF EXISTS on_review_change ON public.reviews;
CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE ON public.reviews
  FOR EACH ROW EXECUTE PROCEDURE public.update_profile_rating();


-- ─── 6. ÍNDICES para performance ────────────────────────────────────────────────

-- Reviews: buscar por usuario revisado (para mostrar en perfil)
CREATE INDEX IF NOT EXISTS idx_reviews_reviewed_id ON public.reviews(reviewed_id);

-- Reviews: buscar por reviewer (para saber si ya dejó review)  
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON public.reviews(reviewer_id);

-- Saved items: buscar por usuario (para cargar guardados)
CREATE INDEX IF NOT EXISTS idx_saved_items_user_id ON public.saved_items(user_id);

-- Proposals: buscar por ambos usuarios (para historial bidireccional)
CREATE INDEX IF NOT EXISTS idx_proposals_from_user ON public.proposals(from_user_id);
CREATE INDEX IF NOT EXISTS idx_proposals_to_user ON public.proposals(to_user_id);

-- Products: buscar por usuario (para "mis productos")
CREATE INDEX IF NOT EXISTS idx_products_user_id ON public.products(user_id);

-- Products: buscar por categoría y región (para filtros)
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_region ON public.products(region);


-- ============================================================================
-- ¡LISTO! Ejecuta este script completo en el SQL Editor de Supabase.
-- Puedes verificar que todo se creó correctamente revisando:
--   Table Editor → reviews
--   Table Editor → saved_items
--   Authentication → Policies
-- ============================================================================
